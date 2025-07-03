import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Game } from '@/data/games';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // 只处理POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 获取游戏数据
    const dataFilePath = path.join(process.cwd(), 'src/data/games.json');
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    const games: Game[] = JSON.parse(jsonData);

    // 查找对应的游戏
    const gameIndex = games.findIndex(game => game.id === id);
    if (gameIndex === -1) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // 获取评论索引和可能的回复索引
    const { commentIndex, replyIndex } = req.body;
    
    // 验证评论索引
    if (commentIndex === undefined || commentIndex < 0 || !games[gameIndex].comments || commentIndex >= games[gameIndex].comments.length) {
      return res.status(400).json({ message: 'Invalid comment index' });
    }

    // 处理点赞
    if (replyIndex !== undefined) {
      // 回复点赞
      const replies = games[gameIndex].comments[commentIndex].replies;
      if (!replies || replyIndex < 0 || replyIndex >= replies.length) {
        return res.status(400).json({ message: 'Invalid reply index' });
      }
      
      // 增加回复的点赞数
      replies[replyIndex].likes += 1;
    } else {
      // 评论点赞
      games[gameIndex].comments[commentIndex].likes += 1;
    }

    // 将更新后的数据写回到文件
    fs.writeFileSync(dataFilePath, JSON.stringify(games, null, 2), 'utf8');

    // 返回成功响应
    return res.status(200).json({ 
      message: 'Like added successfully', 
      comments: games[gameIndex].comments
    });
  } catch (error) {
    console.error('Error processing like:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 