package Project_maker.finance_insight.Budget_model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "budget")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "user_email")
    private String userEmail;


    @Column(name = "budget_month")
    private int month;
    // 1 to 12
    @Column(name = "budget_year_column")
    private int year;        // example 2025
    private double amount;   // Budget amount for that month
}
