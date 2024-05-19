package com.appbackend.appdb.mapper;

import com.appbackend.appdb.entity.Comment;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.springframework.stereotype.Repository;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author lyt
 * @since 2024-04-23
 */
@Repository("commentMapper")
public interface CommentMapper extends BaseMapper<Comment> {

}
