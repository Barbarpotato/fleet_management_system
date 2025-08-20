import prisma from '../utils/db_connection.js'

export const createUser = async ({ username, password, fullName, role, department }) => {
  return await prisma.user.create({ data: { username, password, fullName, role, department } })
}

export const findUserByUsername = async (username) => {
  return await prisma.user.findUnique({ where: { username } })
}

export const getAllUsers = async () => {
  return await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
};
