class AccountRepository {
    /**
     * @type {import("pg").Pool}
     */
    pool;

    /**
     *
     * @param {import("pg").Pool} pool
     */
    constructor(pool) {
        this.pool = pool;
    }

    /**
     *
     * @param {string} id
     * @param {import('pg').PoolClient | undefined} conn
     * @returns {Promise<number|null>}
     */
    async selectIdx(id, conn = this.pool) {
        const queryResult = await conn.query(
            `SELECT
                idx
            FROM
                account
            WHERE
                id =$1
            `,
            [id]
        );
        return queryResult.rows[0];
    }

    /**
     *
     * @param {string} id
     * @param {import('pg').PoolClient | undefined} conn
     * @returns {Promise<number>}
     */
    async insert(id, conn = this.pool) {
        const queryResult = await conn.query(
            `INSERT INTO account
                (id)
            VALUES
                ($1)
            RETURNING
                idx
            `,
            [id]
        );
        return queryResult.rows[0];
    }
}

module.exports = AccountRepository;
