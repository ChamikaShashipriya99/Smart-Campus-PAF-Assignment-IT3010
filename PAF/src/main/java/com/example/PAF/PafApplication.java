package com.example.PAF;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PafApplication {

	public static void main(String[] args) {
		SpringApplication.run(PafApplication.class, args);
	}

}
