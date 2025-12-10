package Project_maker.finance_insight.Dashboard;


import Project_maker.finance_insight.Authorisation.JwtService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService service;
    private final JwtService jwtService;


    public DashboardController(DashboardService service, JwtService jwtService) {
        this.service = service;
        this.jwtService = jwtService;
    }

    private String extractEmail(String token) {
        return jwtService.extractEmail(token.replace("Bearer ", ""));
    }

    // Total expense
    @GetMapping("/total-expense")
    public double getTotalExpense(@RequestHeader("Authorization") String token) {
        return service.getTotalExpense(extractEmail(token));
    }

    // Category Summary
    @GetMapping("/category-summary")
    public Object getCategorySummary(@RequestHeader("Authorization") String token) {
        return service.getCategorySummary(extractEmail(token));
    }
}

