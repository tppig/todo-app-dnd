import { updateItem, getItem } from '../persistence/mysql.js';

export default async (req, res) => {
  await updateItem(req.params.id, {
    name: req.body.name,
    completed: req.body.completed,
  });
  const item = await getItem(req.params.id);
  res.send(item);
};
