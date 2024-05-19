package com.appbackend.appdb.service;

import com.appbackend.appdb.dto.CommentListReq;
import com.appbackend.appdb.entity.Comment;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author lyt
 * @since 2024-04-23
 */
public interface ICommentService extends IService<Comment> {

    public void addComment(String token, int fid, String data, int postId);

    public CommentListReq getCommonListReq(int postId);

}
