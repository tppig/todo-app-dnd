import { getItems } from '../persistence/mysql.js';

export default async (req, res) => {
  const items = await getItems();
  res.send(items);
};
