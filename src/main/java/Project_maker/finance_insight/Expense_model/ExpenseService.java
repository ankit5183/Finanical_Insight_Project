package Project_maker.finance_insight.Expense_model;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpenseService {

    private final ExpenseRepository repo;

    public ExpenseService(ExpenseRepository repo) {
        this.repo = repo;
    }

    // 🔹 Create / Add Expense
    public Expense addExpense(Expense expense) {
        return repo.save(expense);
    }

    // 🔹 Fetch all expenses for a user
    public List<Expense> getExpenses(String email) {
        return repo.findByUserEmail(email);
    }

    // 🔹 Optimized query for total expense
    public double getTotalExpense(String email) {
        return repo.getTotalExpense(email);
    }

    // 🔹 Monthly expenses (list of records)
    public List<Expense> getMonthlyExpense(String email, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.plusMonths(1).minusDays(1);
        return repo.findByUserEmailAndDateBetween(email, start, end);
    }

    // 🔹 Weekly expenses (list of records)
    public List<Expense> getWeeklyExpense(String email, LocalDate date) {
        LocalDate weekStart = date.with(java.time.DayOfWeek.MONDAY);
        LocalDate weekEnd = weekStart.plusDays(6);
        return repo.findByUserEmailAndDateBetween(email, weekStart, weekEnd);
    }

    // 🔹 Weekly total (sum of amounts)
    public double getWeeklyTotal(String email, LocalDate anyDateInWeek) {
        return getWeeklyExpense(email, anyDateInWeek)
                .stream()
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    // 🔹 Category summary (grouped totals)
    public Map<String, Double> getCategorySummary(String email) {
        List<Object[]> results = repo.getCategorySummary(email);
        Map<String, Double> summary = new HashMap<>();

        for (Object[] row : results) {
            summary.put((String) row[0], (Double) row[1]);
        }
        return summary;
    }
         @Transactional
         public void deleteMultipleExpenses(String email, List<Long> ids) {
         repo.deleteByIdInAndUserEmail(ids, email);

         @Transactional
        public void deleteExpense(String email, Long id) {
           repo.deleteByIdAndUserEmail(id, email);
}    
    }
}
