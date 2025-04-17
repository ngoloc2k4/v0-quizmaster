package com.quizmaster.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class OpenrouterConfig {
    
    @Value("${OPENROUTER_API_KEY}")
    private String apiKey;
    
    @Value("${openrouter.api.url}")
    private String apiUrl;
    
    @Bean
    public RestTemplate openrouterRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().add("Authorization", "Bearer " + apiKey);
            request.getHeaders().add("HTTP-Referer", "https://quizmaster-ai.com");
            return execution.execute(request, body);
        });
        return restTemplate;
    }
}
