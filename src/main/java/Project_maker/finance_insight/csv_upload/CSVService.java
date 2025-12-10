package Project_maker.finance_insight.csv_upload;

import Project_maker.finance_insight.Expense_model.Expense;
import Project_maker.finance_insight.Expense_model.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class CSVService {

    private final ExpenseRepository expenseRepository;

    public CSVService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public void processCSV(MultipartFile file, String userEmail) throws Exception {

        BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream())
        );

        String line = reader.readLine();
        if (line != null) {
            line = line.replace("\uFEFF", ""); // Remove BOM
        }

        // Support both date formats
        DateTimeFormatter dashFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        DateTimeFormatter slashFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        while ((line = reader.readLine()) != null) {

            if (line.trim().isEmpty()) continue;

            line = line.replace("\uFEFF", "");

            // Split CSV safely (handles values with commas inside quotes)
            String[] data = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");

            if (data.length < 4) {
                System.out.println("Invalid row: " + line);
                continue;
            }

            String title = data[0].trim().replace("\"", "");
            String amountStr = data[1].trim().replace("\"", "");
            String category = data[2].trim().replace("\"", "");
            String dateStr = data[3].trim().replace("\"", "");

            // Parse amount
            double amount;
            try {
                amount = Double.parseDouble(amountStr);
            } catch (Exception e) {
                System.out.println("Invalid amount: " + amountStr);
                continue;
            }

            // Parse date in two formats
            LocalDate date;
            try {
                if (dateStr.contains("/")) {
                    date = LocalDate.parse(dateStr, slashFormatter);
                } else {
                    date = LocalDate.parse(dateStr, dashFormatter);
                }
            } catch (Exception e) {
                System.out.println("Invalid date: " + dateStr);
                continue;
            }

            // Save expense
            Expense exp = new Expense();
            exp.setTitle(title);
            exp.setAmount(amount);
            exp.setCategory(category);
            exp.setDate(date);
            exp.setUserEmail(userEmail);

            expenseRepository.save(exp);
            System.out.println("Saved Expense: " + exp);
        }
    }
}
