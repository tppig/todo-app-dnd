import { getItem, removeItem, updateItemOrderAfter } from '../persistence/mysql.js';

export default async (req, res) => {
  const item = await getItem(req.params.id);
  await removeItem(req.params.id);
  await updateItemOrderAfter(item.pos);
  res.sendStatus(200);
};
