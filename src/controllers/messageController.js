const { prisma } = require("../config/database");

async function createMessage(req, res) {
  const { groupId } = req.params;
  const { content } = req.body;
  const userId = req.user.id; // From JWT middleware

  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      status: false,
      message: "Message content is required",
    });
  }

  try {
    // Optional: Check if user is group member
    const isMember = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });

    if (!isMember) {
      return res.status(403).json({
        status: false,
        message: "User not authorized for this group",
      });
    }

    const message = await prisma.messages.create({
      data: {
        groupId,
        userId,
        content: content.trim(),
      },
      include: {
        group: { select: { name: true } },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      status: true,
      message: "Message created successfully",
      data: message,
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "internal server error",
      error: e.message,
    });
  }
}

module.exports = createMessage;
