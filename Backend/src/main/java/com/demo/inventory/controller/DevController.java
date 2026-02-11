package com.demo.inventory.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.inventory.model.User;
import com.demo.inventory.repository.UserRepository;

@RestController
@RequestMapping("/dev")
public class DevController {

  private final UserRepository repo;
  private final PasswordEncoder encoder;

  public DevController(UserRepository repo, PasswordEncoder encoder) {
      this.repo = repo; this.encoder = encoder;
  }

  @GetMapping("/reset-admin")
  public String resetAdmin() {
      User u = repo.findByUsername("admin@root.com").orElse(null);
      if (u == null) return "admin not found";
      u.setPassword(encoder.encode("admin123"));
      repo.save(u);
      return "admin password reset to admin123";
  }
}
