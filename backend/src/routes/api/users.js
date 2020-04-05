import { Router } from 'express';

import * as User from '../../controllers/user';


const router = Router();

router.get('/', User.getUserList);
router.get('/:id', User.getUserProfile);

export default router;

/*
router.get('/:id', async function(req, res, next) {
  var userId = req.params.id;
  var userProfile = await query(
    `
    SELECT
      user_id, user_name, description, age, gender, region1, region2, region3
    FROM (
      SELECT user_id, user_name, description FROM user WHERE user_id = '${userId}'
    ) A
    LEFT JOIN (
      SELECT MAX(age) AS age, gender
      FROM user_history WHERE user_id = '${userId}'
      ORDER BY ts DESC LIMIT 1
    ) B ON 1 = 1
    LEFT JOIN (
      SELECT 
        region1, region2, region3
      FROM user_history
      WHERE user_id = '${userId}' AND region1 IS NOT NULL
      GROUP BY region1, region2, region3
      ORDER BY COUNT(*) DESC LIMIT 1
    ) C ON 1 = 1
    `
  );
  
  if (!userProfile || userProfile.length === 0) {
    return res.status(404).send();
  }

  userProfile = userProfile[0];

  userProfile.categories = await query(
    `
    SELECT
      IF(category_id = '9999', NULL, category_id) AS category_id, 
      category_name,
      SUM(amt) AS amt, 
      COUNT(*) AS cnt
    FROM (
      SELECT 
        COALESCE(code, '9999') AS category_id, 
        COALESCE(name, '기타') AS category_name,
        amt
      FROM user_history A 
        LEFT JOIN category_map B USING (category_id) 
        WHERE user_id = ?
    ) A
    GROUP BY category_id, category_name
    ORDER BY amt DESC
    `,
    [userId]
  );

  userProfile.brands = await query(
    `
    SELECT
      brand_id, 
      COALESCE(brand_name, '기타') AS brand_name,
      SUM(amt) AS amt,
      COUNT(*) AS cnt
    FROM user_history
    WHERE user_id = ? 
    GROUP BY brand_id, brand_name
    `,
    [userId]
  );
  
  return res.send(userProfile);
});

router.put('/:id', async function(req, res, next) {
  var userName = req.body.params.user_name || null;
  var description = req.body.params.description || null;
  var userId = req.params.id;
  await query(
    `
      UPDATE user SET user_name = ?, description = ? WHERE user_id = ?
    `,
    [userName, description, userId]
  );
  return res.status(204).send()
});

module.exports = router;
*/