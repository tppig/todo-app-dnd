
import { getItems, updateItemOrder, updateItemOrderBetween } from '../persistence/mysql.js';

export default async (req, res) => {
  const itemId = req.body.itemId;
  const src = req.body.src;
  const dest = req.body.dest;
  console.log(req.body);
  if (src > dest) {
    await updateItemOrderBetween(dest, src - 1, 1);
  } else {
    await updateItemOrderBetween(src + 1, dest, -1);
  }
  await updateItemOrder(itemId, dest);

  const items = await getItems();
  res.send(items);
};
