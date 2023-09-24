package com.talentsprint.cycleshop.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.talentsprint.cycleshop.business.LoginBody;
import com.talentsprint.cycleshop.dto.CycleJsonInputIdCount;
import com.talentsprint.cycleshop.entity.Cart;
import com.talentsprint.cycleshop.entity.Cycle;
import com.talentsprint.cycleshop.entity.User;
import com.talentsprint.cycleshop.exception.CycleNotFoundException;
import com.talentsprint.cycleshop.exception.InsufficientStockException;
import com.talentsprint.cycleshop.service.CartService;
import com.talentsprint.cycleshop.service.CycleService;
import com.talentsprint.cycleshop.service.DomainUserService;
import com.talentsprint.cycleshop.service.RegistrationForm;
import com.talentsprint.cycleshop.service.TransactionService;
import com.talentsprint.cycleshop.service.UserService;

@RestController
@CrossOrigin
@RequestMapping("/api/cycles")
public class CycleRestController {

    private LoginBody loginBody;

    @Autowired
    private CycleService cycleService;

    @Autowired
    private UserService userService;

    @Autowired
    private RegistrationForm registrationForm;

    @Autowired
    private DomainUserService domainUserService;

    @Autowired
    private CartService cartService;

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/{id}/borrow")
    public ResponseEntity<String> borrowCycle(@RequestBody CycleJsonInputIdCount IdCount) {
        try {
            // Validate input
            if (IdCount.getCount() <= 0) {
                return ResponseEntity.badRequest().body("Invalid count for borrowing.");
            }

            // Call the service method to borrow the cycle
            System.out.println(loginBody.getUsername());
            cycleService.borrowCycle(IdCount.getId(), IdCount.getCount());

            return ResponseEntity.ok("Cycle borrowed successfully.");
        } catch (CycleNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (InsufficientStockException e) {
            return ResponseEntity.badRequest().body("Insufficient stock.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<String> returnCycle(
            @RequestBody CycleJsonInputIdCount IdCount) {
        try {
            int returnedCount = cycleService.returnCycle(IdCount.getId(), IdCount.getCount());

            if (returnedCount < 0) {
                return ResponseEntity.badRequest().body("Cannot return more cycles than borrowed.");
            }

            return ResponseEntity.ok("Cycle returned successfully.");
        } catch (CycleNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }

    @PostMapping("/{id}/restock")
    public ResponseEntity<String> restockCycle(
            @RequestBody CycleJsonInputIdCount IdCount) {
        try {
            cycleService.restockBy(IdCount.getId(), IdCount.getCount());
            return ResponseEntity.ok("Cycle restocked successfully.");
        } catch (CycleNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }

    @GetMapping("/list-data")
    public ResponseEntity<List<Cycle>> listAvailableCycles(Authentication authentication) {
        System.out.println("Get Request");
        return ResponseEntity.ok(cycleService.listCycles());
    }

    @PostMapping("/addcycle")
    public ResponseEntity<String> addCycle(@RequestBody Cycle cycle) {
        return cycleService.addCycle(cycle);
    }

    @PostMapping("/register")

    public ResponseEntity<String> registerUser(@RequestBody RegistrationForm registrationForm) {

        try {
            String username = registrationForm.getUsername();
            String password = registrationForm.getPassword();

            // Check if the username and password are both "admin"
            if ("admin".equals(username) && "admin".equals(password)) {
                registrationForm.setRole("ADMIN");
            } else {
                registrationForm.setRole("USER");
            }

            if (domainUserService.getByName(registrationForm.getUsername()) == null) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");

            }

            if (!registrationForm.getPassword().equals(registrationForm.getRepeatPassword())) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password doesnot match");

            }

            System.out.println(domainUserService.save(registrationForm.getUsername(), registrationForm.getPassword(),
                    registrationForm.getRole()));

            return ResponseEntity.ok("User registered successfully");

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + e.getMessage());

        }

    }

    @PostMapping("/{id}/cart")

    public ResponseEntity<String> cartCyclePostMapping(@PathVariable long id,
            @RequestBody Map<String, Integer> requestData) {

        int count = requestData.getOrDefault("count", 1);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        cartService.addToCart(count, id, username);

        return ResponseEntity.status(HttpStatus.OK).body("Cycle added to cart successfully");

    }

    @GetMapping("/cart")

    public ResponseEntity<List<Cart>> listCyclesInCart() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        long userId = userService.getByName(username).get().getId();

        System.out.println(userId);

        var allCyclesInCart = cartService.getCyclesByUserId(userId);

        System.out.println(allCyclesInCart);

        return ResponseEntity.status(HttpStatus.OK).body(allCyclesInCart);

    }

    @PostMapping("/checkOut")

    public void rentCycles(@RequestBody Map<String, Integer> requestData) {

        double totalAmount = requestData.getOrDefault("totalAmount", 0);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        transactionService.rentCycles(username, totalAmount);

    }

    @PostMapping("/return")

    public ResponseEntity<String> returnRentedCycle(@RequestBody Map<String, Integer> requestData) {
        long cartId = requestData.getOrDefault("cartId", 1);
        cartService.returnCycle(cartId);
        return ResponseEntity.status(HttpStatus.OK).body("Cycle returned successfully");
    }
}
