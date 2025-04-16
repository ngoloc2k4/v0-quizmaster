package com.quizmaster.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.quizmaster.repository")
@EnableMongoAuditing
public class MongoConfig {
    
    // Additional MongoDB configuration can be added here if needed
    
}
