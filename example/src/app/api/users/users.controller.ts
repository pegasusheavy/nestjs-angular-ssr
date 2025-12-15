import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// In-memory database for demo purposes
const users: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'user' },
];

@Controller('api/users')
export class UsersController {
  @Get()
  findAll(): User[] {
    return users;
  }

  @Get(':id')
  findOne(@Param('id') id: string): User | { error: string } {
    const user = users.find((u) => u.id === Number(id));
    if (!user) {
      return { error: 'User not found' };
    }
    return user;
  }

  @Post()
  create(@Body() body: Omit<User, 'id'>): User {
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      ...body,
    };
    users.push(newUser);
    return newUser;
  }

  @Delete(':id')
  remove(@Param('id') id: string): { success: boolean } {
    const index = users.findIndex((u) => u.id === Number(id));
    if (index === -1) {
      return { success: false };
    }
    users.splice(index, 1);
    return { success: true };
  }
}

