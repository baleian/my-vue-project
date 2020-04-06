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
      description = ?
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
    ) A JOIN state B
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
      IF(user_count_avg IS NULL OR user_count_avg < 0, 0, user_count_avg) AS userCountAverage,
      IF(user_amount_avg IS NULL OR user_amount_avg < 0, 0, user_amount_avg) AS userAmountAverage,
      COALESCE((LOG(IF(count < 0, 0, count)) - user_count_log_avg) / user_count_log_stddev, 100) AS countZscore,
      COALESCE((LOG(IF(amount < 0, 0, amount)) - user_amount_log_avg) / user_amount_log_stddev, 100) AS amountZscore
    FROM (
      SELECT 
        category_id, 
        ANY_VALUE(category_name) AS category_name,
        SUM(IF(amt > 0, 1, IF(amt < 0, -1, 0))) AS count,
        SUM(amt) AS amount
      FROM user_history
      WHERE user_id = ?
      GROUP BY category_id
    ) A 
    LEFT JOIN category_state B USING (category_id)
    ORDER BY categoryId
    `,
    [userId]
  );
}

export function getUserBrandState(userId) {
  return query(
    `
    SELECT
      brand_id AS brandId, 
      brand_name AS brandName,
      CAST(count AS SIGNED) AS count, amount,
      IF(user_count_avg IS NULL OR user_count_avg < 0, 0, user_count_avg) AS userCountAverage,
      IF(user_amount_avg IS NULL OR user_amount_avg < 0, 0, user_amount_avg) AS userAmountAverage,
      COALESCE((LOG(IF(count < 0, 0, count)) - user_count_log_avg) / user_count_log_stddev, 100) AS countZscore,
      COALESCE((LOG(IF(amount < 0, 0, amount)) - user_amount_log_avg) / user_amount_log_stddev, 100) AS amountZscore
    FROM (
      SELECT 
        COALESCE(brand_id, 'B999999') AS brand_id, 
        COALESCE(ANY_VALUE(brand_name), '기타') AS brand_name,
        SUM(IF(amt > 0, 1, IF(amt < 0, -1, 0))) AS count,
        SUM(amt) AS amount
      FROM user_history
      WHERE user_id = ?
      GROUP BY brand_id
    ) A
    LEFT JOIN brand_state B USING (brand_id)
    ORDER BY brandId
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

export function getUserBrandHistory(userId) {
  return query(
    `
    SELECT
      DATE_FORMAT(DATE(CONVERT_TZ(ts, 'SYSTEM', '+09:00')), '%Y-%m-%d') AS date,
      COALESCE(brand_id, 'B999999') AS brandId,
      COALESCE(ANY_VALUE(brand_name), '기타') AS brandName,
      SUM(IF(amt > 0, 1, IF(amt < 0, -1, 0))) AS count,
      SUM(amt) AS amount
    FROM user_history
    WHERE user_id = ?
    GROUP BY DATE(CONVERT_TZ(ts, 'SYSTEM', '+09:00')), brand_id
    ORDER BY date, brandId
    `,
    [userId]
  );
}
