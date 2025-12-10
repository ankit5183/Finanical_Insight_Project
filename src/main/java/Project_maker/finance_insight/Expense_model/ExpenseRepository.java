package Project_maker.finance_insight.Expense_model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserEmail(String email);

    List<Expense> findByUserEmailAndDateBetween(String email, LocalDate start, LocalDate end);

    // Total Expense for Dashboard
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.userEmail = :email")
    Double getTotalExpense(@Param("email") String email);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e " +
            "WHERE e.userEmail = :email " +
            "AND FUNCTION('MONTH', e.date) = :month " +
            "AND FUNCTION('YEAR', e.date) = :year")
    Double sumMonthlyExpense(@Param("email") String email,
                             @Param("month") int month,
                             @Param("year") int year);

    @Query("SELECT e.category, COALESCE(SUM(e.amount), 0) " +
            "FROM Expense e " +
            "WHERE e.userEmail = :email " +
            "GROUP BY e.category")
    List<Object[]> getCategorySummary(@Param("email") String email);
}
