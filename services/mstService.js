const prisma = require("../prisma/db");

async function create(model, data) {
  return prisma[model].create({ data });
}

async function findAll(model, onlyActive = true) {
  if (!onlyActive) {
    return prisma[model].findMany();
  }

  try {
    return await prisma[model].findMany({
      where: { is_active: true },
    });
  } catch {
    // If "is_active" doesn't exist on the model
    return prisma[model].findMany();
  }
}

async function findOne(model, primaryKey, id) {
  return prisma[model].findUnique({
    where: { [primaryKey]: id },
  });
}

async function update(model, primaryKey, id, data) {
  return prisma[model].update({
    where: { [primaryKey]: id },
    data,
  });
}

async function remove(model, primaryKey, id) {
  try {
    await prisma[model].update({
      where: { [primaryKey]: id },
      data: { is_active: false },
    });
    return { softDeleted: true };
  } catch {
    await prisma[model].delete({
      where: { [primaryKey]: id },
    });
    return { softDeleted: false };
  }
}

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
