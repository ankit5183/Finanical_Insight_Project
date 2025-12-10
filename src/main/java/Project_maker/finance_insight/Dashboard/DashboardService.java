package Project_maker.finance_insight.Dashboard;


import Project_maker.finance_insight.Expense_model.ExpenseRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ExpenseRepository repo;


    public DashboardService(ExpenseRepository repo) {
        this.repo = repo;
    }

    // Total Expense
    public double getTotalExpense(String email) {
        return repo.getTotalExpense(email);
    }

    // Category Summary (Map<String,Double>)
    public Object getCategorySummary(String email) {
        return repo.getCategorySummary(email);
    }


}