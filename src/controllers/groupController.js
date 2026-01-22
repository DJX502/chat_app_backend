const { prisma } = require("../config/database");
const Role = {
  admin: "admin",
  user: "user",
};
async function createGroup(req, res) {
  const { userId } = req.user;
  const { name } = req.body;

  if (!name) {
    res.status(403).json({ status: false, message: "Enter the name of group" });
  }
  try {
    const group = await prisma.group.create({
      data: {
        name: name,
        creator: userId,
        role: Role.admin,
      },
    });
    res.status(201).json({
      status: true,
      message: "group created successfully",
      data: group,
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "internal server error",
      error: e.message,
    });
  }
}
//add memeber to group
async function addMember(req, res) {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const existingMember = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });

    if (existingMember) {
      res
        .status(400)
        .json({ status: false, message: "user already exists in group" });
    }
    const member = await prisma.groupMember.create({
      data: {
        groupId,
        userId,
      },
      include: {
        group: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
    });
    res.status(201).json({
      status: true,
      message: "member added successfully",
      data: member,
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "internal server error",
      error: e.message,
    });
  }
}

//view your group member

async function getMembers(req, res) {
  const { groupId } = req.params;

  try {
    const groupMembers = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        _count: {
          select: { groupMember: true },
        },
        groupMember: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });
    res.status(200).json({
      status: true,
      message: "group members feteched",
      data: groupMembers,
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "internal server error",
      error: e.message,
    });
  }
}

module.exports = { createGroup, addMember, getMembers };
