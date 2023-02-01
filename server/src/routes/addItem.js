import { storeItem } from '../persistence/mysql.js';
import { v4 as uuid } from 'uuid';

export default async (req, res) => {
  const item = {
    id: uuid(),
    name: req.body.name,
    completed: false,
    pos: req.body.pos,
  };
  await storeItem(item);
  res.send(item);
};
