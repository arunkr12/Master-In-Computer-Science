package com.example.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String welcomePage() {
        return "<h1>Welcome to SecureApp!</h1>" +
                "<p>You have successfully authenticated via HTTPS using your H2 database credentials.</p>" +
                "<p>Your security layer is working perfectly along with no  SQL injection.</p>";
    }
}