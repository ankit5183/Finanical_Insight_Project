package Project_maker.finance_insight.Budget_model;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Optional<Budget> findByUserEmailAndYearAndMonth(String userEmail, int year, int month);

}
