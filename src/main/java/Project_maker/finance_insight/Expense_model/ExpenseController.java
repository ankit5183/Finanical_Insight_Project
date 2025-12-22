package Project_maker.finance_insight.Expense_model;

import Project_maker.finance_insight.Authorisation.JwtService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expense")
public class ExpenseController {

    private final ExpenseService service;
    private final JwtService jwtService;

    public ExpenseController(ExpenseService service, JwtService jwtService) {
        this.service = service;
        this.jwtService = jwtService;
    }

    /* -------------------- JWT EMAIL -------------------- */
    private String extractEmail(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtService.extractEmail(token);
    }

    /* -------------------- ADD EXPENSE -------------------- */
    @PostMapping("/add")
    public Expense addExpense(
            @RequestHeader("Authorization") String token,
            @RequestBody Expense expense) {

        String email = extractEmail(token);
        expense.setUserEmail(email);
        return service.addExpense(expense);
    }

    /* -------------------- ALL EXPENSE -------------------- */
    @GetMapping("/all")
    public List<Expense> allExpenses(
            @RequestHeader("Authorization") String token) {

        return service.getExpenses(extractEmail(token));
    }

    /* -------------------- MONTHLY EXPENSE -------------------- */
    @GetMapping("/monthly")
    public List<Expense> monthly(
            @RequestHeader("Authorization") String token,
            @RequestParam int year,
            @RequestParam int month) {

        return service.getMonthlyExpense(
                extractEmail(token),
                year,
                month
        );
    }

    /* -------------------- TOTAL EXPENSE -------------------- */
    @GetMapping("/total")
    public double totalExpense(
            @RequestHeader("Authorization") String token) {

        return service.getTotalExpense(extractEmail(token));
    }

    /* -------------------- WEEKLY EXPENSE -------------------- */
    @GetMapping("/weekly")
    public List<Expense> weeklyExpense(
            @RequestHeader("Authorization") String token,
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam int day) {

        LocalDate date = LocalDate.of(year, month, day);
        return service.getWeeklyExpense(extractEmail(token), date);
    }

    /* -------------------- WEEKLY TOTAL -------------------- */
    @GetMapping("/weekly/total")
    public double weeklyTotal(
            @RequestHeader("Authorization") String token,
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam int day) {

        LocalDate date = LocalDate.of(year, month, day);
        return service.getWeeklyTotal(extractEmail(token), date);
    }

    /* -------------------- CATEGORY SUMMARY -------------------- */
    @GetMapping("/category-summary")
    public Map<String, Double> categorySummary(
            @RequestHeader("Authorization") String token) {

        return service.getCategorySummary(extractEmail(token));
    }

    /* -------------------- SINGLE DELETE -------------------- */
    @DeleteMapping("/{id}")
    public void deleteExpense(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {

        service.deleteExpense(extractEmail(token), id);
    }

    /* -------------------- MULTIPLE DELETE -------------------- */
    @DeleteMapping("/bulk-delete")
    public void deleteMultipleExpenses(
            @RequestHeader("Authorization") String token,
            @RequestBody List<Long> ids) {

        service.deleteMultipleExpenses(extractEmail(token), ids);
    }
}
