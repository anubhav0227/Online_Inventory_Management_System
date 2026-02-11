package com.demo.inventory.config;

import com.demo.inventory.model.User;
import com.demo.inventory.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

  @Bean
  public ApplicationRunner init(UserRepository repo, PasswordEncoder encoder) {
    return args -> {

      String adminEmail = "admin@root.com";

      if (!repo.existsByUsername(adminEmail)) {
        User u = new User();
        u.setName("Root Admin");
        u.setUsername(adminEmail);
        u.setPassword(encoder.encode("admin123"));
        u.setRole("ROLE_ADMIN");

        repo.save(u);

        System.out.println(
          "Seeded root admin -> " + adminEmail + " / admin123"
        );
      }
    };
  }
}

