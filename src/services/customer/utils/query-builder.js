export const queryBuilder = (fields, clientId, userId) => {
  let toUpdate = Object.keys(fields).reduce((acc, key) => {
    return `${acc + key} = '${fields[key]}',`;
  }, "");

  const finalSet = toUpdate.slice(0, toUpdate.length - 1);

  const query = `
    UPDATE clientes
    SET ${finalSet}
    WHERE id = ${clientId}
        AND userid = ${userId}
        AND deleted_at IS NULL
    `;

  return query;
};
