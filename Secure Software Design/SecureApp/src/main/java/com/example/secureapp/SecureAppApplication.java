package com.example.secureapp;

import com.example.repository.UserRepository;
import com.example.model.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.repository")
@EntityScan(basePackages = "com.example.model")
@ComponentScan(basePackages = "com.example")
public class SecureAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecureAppApplication.class, args);
    }

    @Bean
    CommandLineRunner initializeDatabase(UserRepository repository, PasswordEncoder encoder) {
        return args -> {
            if (repository.findByUsername("it_employee").isEmpty()) {
                repository.save(new User("it_employee", encoder.encode("safePass77"), "IT_ADMIN"));
                System.out.println(">> H2 Database has been securely seeded with a record.");
            }
        };
    }
}