import sys
import os
import psycopg2
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
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

    param_grid = {
        'n_estimators': [50, 100, 200, 300],
        'max_depth': [None, 10, 20, 30],
        'min_samples_leaf': [1, 2, 4, 6],
        'min_samples_split': [2, 5, 10, 15]
    }

    grid_search = GridSearchCV(estimator=RandomForestRegressor(random_state=42), param_grid=param_grid, cv=5, n_jobs=-1, verbose=1)
    grid_search.fit(X, y)  
    best_model = grid_search.best_estimator_

    cv_results = grid_search.cv_results_
    print(f"Best parameters: {grid_search.best_params_}")
    print(f"Best cross-validation score (R^2): {grid_search.best_score_}")

    
    predicted_scores = best_model.predict(X)
    update_query = "UPDATE score SET expected_score = %s WHERE idx = %s"
    try:
        cursor.execute("BEGIN;")
        for idx, pred in zip(data['score_idx'], predicted_scores):
            cursor.execute(update_query, (int(pred), idx))
        cursor.execute("COMMIT;")
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        cursor.execute("ROLLBACK;")  
    cursor.close()
    conn.close()

if __name__ == '__main__':
    print("python start")
    main(sys.argv[1])
