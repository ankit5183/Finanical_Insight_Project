package Project_maker.finance_insight.Expense_model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserEmail(String email);

    // Filter by User and specific Month/Year (Used by Budget)
    @Query("SELECT COALESCE(SUM(e.amount), 0.0) FROM Expense e " +
           "WHERE e.userEmail = :email " +
           "AND MONTH(e.date) = :month " +
           "AND YEAR(e.date) = :year")
    Double sumMonthlyExpense(@Param("email") String email, 
                             @Param("month") int month, 
                             @Param("year") int year);

    // Total Expense for Dashboard
    @Query("SELECT COALESCE(SUM(e.amount), 0.0) FROM Expense e WHERE e.userEmail = :email")
    Double getTotalExpense(@Param("email") String email);

    // Category Wise Summary
    @Query("SELECT e.category, SUM(e.amount) " +
           "FROM Expense e " +
           "WHERE e.userEmail = :email " +
           "GROUP BY e.category")
    List<Object[]> getCategorySummary(@Param("email") String email);
}
