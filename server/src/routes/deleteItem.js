import { removeItem } from '../persistence/mysql.js';

export default async (req, res) => {
  await removeItem(req.params.id);
  res.sendStatus(200);
};
