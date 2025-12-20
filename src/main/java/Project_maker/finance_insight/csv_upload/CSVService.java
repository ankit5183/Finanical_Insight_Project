package Project_maker.finance_insight.csv_upload;

import Project_maker.finance_insight.Expense_model.Expense;
import Project_maker.finance_insight.Expense_model.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class CSVService {

    private final ExpenseRepository expenseRepository;

    public CSVService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public void processCSV(MultipartFile file, String userEmail) throws Exception {
        // Use Try-with-resources to ensure the reader closes automatically
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            boolean isHeader = true;

            // Use more flexible formatters (e.g., M/d/yyyy allows 1/1/2025 and 01/01/2025)
            DateTimeFormatter slashFormatter = DateTimeFormatter.ofPattern("d/M/yyyy");
            DateTimeFormatter dashFormatter = DateTimeFormatter.ofPattern("d-M-yyyy");
            DateTimeFormatter isoFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            List<Expense> expensesToSave = new ArrayList<>();

            while ((line = reader.readLine()) != null) {
                // Remove BOM and whitespace
                line = line.replace("\uFEFF", "").trim();
                
                if (line.isEmpty()) continue;

                // Skip the header row
                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                // Split CSV safely
                String[] data = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");

                if (data.length < 4) {
                    System.err.println("Skipping invalid row (insufficient columns): " + line);
                    continue;
                }

                try {
                    String title = data[0].trim().replace("\"", "");
                    String amountStr = data[1].trim().replace("\"", "");
                    String category = data[2].trim().replace("\"", "");
                    String dateStr = data[3].trim().replace("\"", "");

                    // 1. Parse amount
                    double amount = Double.parseDouble(amountStr);

                    // 2. Parse date with multiple fallbacks
                    LocalDate date = parseDate(dateStr, slashFormatter, dashFormatter, isoFormatter);

                    // 3. Create Expense Object
                    Expense exp = new Expense();
                    exp.setTitle(title);
                    exp.setAmount(amount);
                    exp.setCategory(category);
                    exp.setDate(date);
                    exp.setUserEmail(userEmail);

                    expensesToSave.add(exp);

                } catch (Exception e) {
                    System.err.println("Error parsing row: " + line + " | Error: " + e.getMessage());
                    // Keep going to next row instead of crashing the whole upload
                }
            }

            // Save all at once for better performance
            if (!expensesToSave.isEmpty()) {
                expenseRepository.saveAll(expensesToSave);
                System.out.println("Successfully saved " + expensesToSave.size() + " expenses.");
            } else {
                throw new Exception("No valid data found in CSV file.");
            }
        }
    }

    private LocalDate parseDate(String dateStr, DateTimeFormatter slash, DateTimeFormatter dash, DateTimeFormatter iso) {
        try {
            if (dateStr.contains("/")) return LocalDate.parse(dateStr, slash);
            if (dateStr.contains("-")) {
                if (dateStr.indexOf("-") == 4) return LocalDate.parse(dateStr, iso); // yyyy-MM-dd
                return LocalDate.parse(dateStr, dash);
            }
            return LocalDate.parse(dateStr); // Default ISO
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format: " + dateStr);
        }
    }
}
