flowchart TD
  LP[Landing Page] -->|Select Sign Up| SU[Sign Up Page]
  LP -->|Select Sign In| SI[Sign In Page]
  SU -->|Submit Credentials| AUTH[Auth API]
  SI -->|Submit Credentials| AUTH[Auth API]
  AUTH -->|Success| DASH[Dashboard]
  AUTH -->|Failure| AERR[Authentication Error Page]
  subgraph Protected Routes
    DASH
    SETTINGS[Settings Page]
  end
  DASH --> SETTINGS
  DASH -->|Log Out| LO[Log Out]
  LO --> LP
  AERR --> LP
  DASH -->|Data Load Error| DERR[Data Load Error]
  DERR --> DASH