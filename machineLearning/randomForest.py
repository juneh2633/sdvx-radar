import sys
import os
import psycopg2
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
from dotenv import load_dotenv

def main(user_idx):
    load_dotenv()  
    host = os.getenv('DB_HOST')
    dbname = os.getenv('DB_DATABASE')
    user = os.getenv('DB_USER')
    password = os.getenv('DB_PASSWORD')
    port = os.getenv('DB_PORT')

    conn = psycopg2.connect(host=host, dbname=dbname, user=user, password=password, port=port)
    cursor = conn.cursor()

    query = """
        SELECT 
            score.score AS "score",
            score.idx AS "score_idx",
            difficulties.notes AS "notes",
            difficulties.peak AS "peak",
            difficulties.tsumami AS "tsumami",
            difficulties.tricky AS "tricky",
            difficulties.handtrip AS "handtrip",
            difficulties.onehand AS "onehand"
        FROM 
            score 
        JOIN
            difficulties
        ON
            difficulties.idx = score.difficulties_idx
        WHERE
            user_idx = %s
    """
    cursor.execute(query, (user_idx,))
    data = pd.DataFrame(cursor.fetchall(), columns=[desc[0] for desc in cursor.description])

    scaler = StandardScaler()
    X = scaler.fit_transform(data[['notes', 'peak', 'tsumami', 'tricky', 'handtrip', 'onehand']])
    y = data['score'].values
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [None, 10, 20],
        'min_samples_leaf': [1, 2, 4],
        'min_samples_split': [2, 5, 10]
    }
    grid_search = GridSearchCV(estimator=RandomForestRegressor(random_state=42), param_grid=param_grid, cv=3, n_jobs=-1, verbose=1)
    grid_search.fit(X_train, y_train)
    best_model = grid_search.best_estimator_

    predicted_scores_full = best_model.predict(X)
    update_query = "UPDATE score SET expected_score = %s WHERE idx = %s"

    # 트랜잭션 시작
    try:
        cursor.execute("BEGIN;")
        for idx, pred in zip(data['score_idx'], predicted_scores_full):
            cursor.execute(update_query, (int(pred), idx))
        cursor.execute("COMMIT;")
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        cursor.execute("ROLLBACK;")  # 롤백 실행

    cursor.close()
    conn.close()

if __name__ == '__main__':
    print("python start")
    main(sys.argv[1])
