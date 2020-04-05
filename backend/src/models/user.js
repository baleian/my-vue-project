import { query, selectOne } from '../helpers/db';


export function getUserList() {
  return query(
    `
    SELECT 
      user_id AS userId, 
      age, gender, 
      user_name AS userName, 
      description 
    FROM user
    `
  );
}

export function getUser(userId) {
  return selectOne(
    `
    SELECT 
      user_id AS userId, 
      age, gender, 
      user_name AS userName, 
      description 
    FROM user 
    WHERE user_id = ?
    `,
    [userId]
  );
}

export function setUser(userId, { userName, description }) {
  return query(
    `
    UPDATE user SET
      user_name = ?,
      description = ?,
    WHERE user_id = ?
    `,
    [userName, description, userId]
  );
}

export function getUserState(userId) {
  return selectOne(
    `
    SELECT
      CAST(count AS SIGNED) AS count, amount,
      (LOG(IF(count < 0, 0, count)) - user_count_log_avg) / user_count_log_stddev AS countZscore,
      (LOG(IF(amount < 0, 0, amount)) - user_amount_log_avg) / user_amount_log_stddev AS amountZscore
    FROM (
      SELECT 
        SUM(IF(amt > 0, 1, IF(amt < 0, -1, 0))) AS count,
        SUM(amt) AS amount
      FROM user_history
      WHERE user_id = ?
    ) A 
    JOIN state B ON B.category_id IS NULL
    `,
    [userId]
  );
}

export function getUserCategoryState(userId) {
  return query(
    `
    SELECT
      category_id AS categoryId,
      category_name AS categoryName,
      CAST(count AS SIGNED) AS count, amount,
      user_count_avg AS userCountAverage,
      user_amount_avg AS userAmountAverage,
      (LOG(IF(count < 0, 0, count)) - user_count_log_avg) / user_count_log_stddev AS countZscore,
      (LOG(IF(amount < 0, 0, amount)) - user_amount_log_avg) / user_amount_log_stddev AS amountZscore
    FROM (
      SELECT 
        category_id, ANY_VALUE(category_name) AS category_name,
        SUM(IF(amt > 0, 1, IF(amt < 0, -1, 0))) AS count,
        SUM(amt) AS amount
      FROM user_history
      WHERE user_id = ?
      GROUP BY category_id
    ) A 
    LEFT JOIN state B USING (category_id)
    ORDER BY category_id
    `,
    [userId]
  );
}

export function getUserBrandState(userId) {
  return query(
    `
    SELECT
      brand_id AS brandId,
      COALESCE(brand_name, '기타') AS brandName,
      CAST(count AS SIGNED) AS count, amount
    FROM (
      SELECT 
        brand_id, ANY_VALUE(brand_name) AS brand_name,
        SUM(IF(amt > 0, 1, IF(amt < 0, -1, 0))) AS count,
        SUM(amt) AS amount
      FROM user_history
      WHERE user_id = ?
      GROUP BY brand_id
    ) A
    ORDER BY brand_id
    `,
    [userId]
  );
}

export function getUserHistory(userId) {
  return query(
    `
    SELECT
      ts, 
      store_id AS storeId, 
      brand_id AS brandId, 
      category_id AS categoryId, 
      keyword, 
      brand_name AS brandName, 
      merchant_name AS merchantName, 
      store_name AS storeName, 
      category_name AS categoryName,
      latitude, longitude, 
      amt AS amount
    FROM user_history
    WHERE user_id = ?
    ORDER BY ts
    `,
    [userId]
  );
}

export function getUserCategoryHistory(userId) {
  return query(
    `
    SELECT
      DATE_FORMAT(DATE(CONVERT_TZ(ts, 'SYSTEM', '+09:00')), '%Y-%m-%d') AS date,
      category_id AS categoryId,
      ANY_VALUE(category_name) AS categoryName,
      SUM(IF(amt > 0, 1, IF(amt < 0, -1, 0))) AS count,
      SUM(amt) AS amount
    FROM user_history
    WHERE user_id = ?
    GROUP BY DATE(CONVERT_TZ(ts, 'SYSTEM', '+09:00')), category_id
    ORDER BY date, categoryId
    `,
    [userId]
  );
}
