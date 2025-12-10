package Project_maker.finance_insight.Budget_model;


import lombok.Data;

@Data
public class BudgetRequest {
    private int year;
    private int month;
    private double amount;


    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public int getMonth() { return month; }
    public void setMonth(int month) { this.month = month; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
}




