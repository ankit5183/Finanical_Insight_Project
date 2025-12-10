package Project_maker.finance_insight.Configuration;

import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.time.format.DateTimeFormatter;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class LocalDateConfig {

    private static final String DATE_FORMAT = "dd-MM-yyyy";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern(DATE_FORMAT);

    @Bean
    public Jackson2ObjectMapperBuilder jacksonBuilder() {
        JavaTimeModule module = new JavaTimeModule();
        module.addSerializer(new LocalDateSerializer(DATE_FORMATTER));
        module.addDeserializer(java.time.LocalDate.class, new LocalDateDeserializer(DATE_FORMATTER));

        return new Jackson2ObjectMapperBuilder()
                .modules(module);
    }
}


