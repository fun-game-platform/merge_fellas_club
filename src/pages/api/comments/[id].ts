import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Game, GameComment } from '@/data/games';
import { sanitizeText, formatCommentTime } from '@/lib/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // 只处理POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' });
  }

  try {
    // 获取游戏数据
    const dataFilePath = path.join(process.cwd(), 'src/data/games.json');
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    const games: Game[] = JSON.parse(jsonData);

    // 查找对应的游戏
    const gameIndex = games.findIndex(game => game.id === id);
    if (gameIndex === -1) {
      return res.status(404).json({ message: '游戏未找到' });
    }

    // 验证评论数据
    const commentData = req.body as GameComment;
    if (!commentData || !commentData.text || !commentData.author) {
      return res.status(400).json({ message: '无效的评论数据' });
    }

    // 过滤评论内容，防止XSS攻击
    const sanitizedComment: GameComment = {
      author: sanitizeText(commentData.author),
      text: sanitizeText(commentData.text),
      time: formatCommentTime(), // 这将返回一个ISO日期时间字符串
      likes: 0,
      replies: []
    };

    // 添加评论到游戏数据
    if (!games[gameIndex].comments) {
      games[gameIndex].comments = [];
    }
    games[gameIndex].comments.unshift(sanitizedComment);

    // 将更新后的数据写回到文件
    fs.writeFileSync(dataFilePath, JSON.stringify(games, null, 2), 'utf8');

    // 返回成功响应
    return res.status(200).json({ 
      message: '评论已添加', 
      comment: sanitizedComment,
      comments: games[gameIndex].comments
    });
  } catch (error) {
    console.error('处理评论时出错:', error);
    return res.status(500).json({ message: '服务器内部错误' });
  }
} 