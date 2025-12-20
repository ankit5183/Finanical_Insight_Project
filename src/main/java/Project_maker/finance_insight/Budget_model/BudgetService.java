package Project_maker.finance_insight.Budget_model;

import Project_maker.finance_insight.Expense_model.ExpenseRepository;
import org.springframework.stereotype.Service;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;

    public BudgetService(BudgetRepository budgetRepository, ExpenseRepository expenseRepository) {
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
    }

    // 🔹 Save or update monthly budget
    public void setMonthlyBudget(String email, int year, int month, double amount) {

        Budget budget = budgetRepository
                .findByUserEmailAndYearAndMonth(email, year, month)
                .orElse(new Budget());

        budget.setUserEmail(email);
        budget.setYear(year);
        budget.setMonth(month);
        budget.setAmount(amount);

        budgetRepository.save(budget);
    }

    // 🔹 Get saved monthly budget
    public double getBudget(String email, int year, int month) {
        return budgetRepository
                .findByUserEmailAndYearAndMonth(email, year, month)
                .map(Budget::getAmount)
                .orElse(0.0);
    }

    // 🔹 Total money spent in the month
    public double getMonthlySpent(String email, int year, int month) {
        Double spent = expenseRepository.sumMonthlyExpense(email, month, year);
        return spent != null ? spent : 0.0;
    }

    // 🔹 Update existing budget
    public Budget updateMonthlyBudget(String email, int year, int month, double amount) {
    Budget budget = budgetRepository
            .findByUserEmailAndYearAndMonth(email, year, month)
            .orElse(new Budget());

    budget.setUserEmail(email);
    budget.setYear(year);
    budget.setMonth(month);
    budget.setAmount(amount);

    return budgetRepository.save(budget);
}

    // 🔹 Delete a monthly budget
    public void deleteBudget(String email, int year, int month) {
        budgetRepository
                .findByUserEmailAndYearAndMonth(email, year, month)
                .ifPresent(budgetRepository::delete);
    }

}
