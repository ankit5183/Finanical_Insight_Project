package Project_maker.finance_insight.Authorisation;

public class LoginResponse {
    private String token;
    private String message;

    public LoginResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    // getters
    public String getToken() { return token; }
    public String getMessage() { return message; }
}
