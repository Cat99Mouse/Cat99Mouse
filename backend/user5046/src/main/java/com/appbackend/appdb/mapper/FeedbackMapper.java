package com.appbackend.appdb.mapper;

import com.appbackend.appdb.entity.Feedback;
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
@Repository("feedbackMapper")
public interface FeedbackMapper extends BaseMapper<Feedback> {

}
