package com.demo.inventory.service;

import com.demo.inventory.model.User;

public interface ProfileService {

    User getProfile(String username);

    User updateProfile(String username, String newUsername, String newPassword);
}
