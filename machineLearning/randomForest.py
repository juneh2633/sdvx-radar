import os
from dotenv import load_dotenv
load_dotenv()
import psycopg2
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler

# 데이터베이스 연결 정보

host = os.getenv('DB_HOST')
dbname = os.getenv('DB_DATABASE')
user = os.getenv('DB_USER')
password = os.getenv('DB_PASSWORD')
port = os.getenv('DB_PORT')
user_idx = 1

conn = psycopg2.connect(f"host={host} dbname={dbname} user={user} password={password} port={port}")
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

# predicted_scores = best_model.predict(X_test)
# mse = mean_squared_error(y_test, predicted_scores)
# r2 = r2_score(y_test, predicted_scores)
# print(f"MSE: {mse}, R^2: {r2}")


predicted_scores_full = best_model.predict(X)


update_query = "UPDATE score SET expected_score = %s WHERE idx = %s"
for idx, pred in zip(data['score_idx'], predicted_scores_full):
    cursor.execute(update_query, (int(pred), idx))


conn.commit()
cursor.close()
conn.close()
