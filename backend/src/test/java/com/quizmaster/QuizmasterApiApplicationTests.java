package com.quizmaster;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import com.quizmaster.config.TestMongoConfig;

@SpringBootTest
@ContextConfiguration(classes = {QuizmasterApiApplication.class, TestMongoConfig.class})
@ActiveProfiles("test")
class QuizmasterApiApplicationTests {

    @Test
    void contextLoads() {
        // This test will pass if the application context loads successfully
    }
}
