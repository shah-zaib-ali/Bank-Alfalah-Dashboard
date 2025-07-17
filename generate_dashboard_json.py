import pandas as pd
import numpy as np
import json
import os

print("Starting dashboard JSON file generation...")

try:
    # Load the CSV file that was generated in the notebook
    csv_path = 'bank_alfalah_data.csv'
    print(f"Loading data from {csv_path}...")
    bank_data = pd.read_csv(csv_path)
    
    # Convert date columns to datetime
    bank_data['AccountOpeningDate'] = pd.to_datetime(bank_data['AccountOpeningDate'])
    bank_data['LastTransactionDate'] = pd.to_datetime(bank_data['LastTransactionDate'])
    
    # Create additional features that were created in the notebook
    bank_data['DaysSinceLastTransaction'] = (pd.to_datetime('2023-06-30') - bank_data['LastTransactionDate']).dt.days
    bank_data['TransactionFrequency'] = bank_data['NumTransactions30Days'] / 30
    
    # Create risk categories based on credit score
    def assign_risk_category(score):
        if score < 580:
            return 'High Risk'
        elif score < 670:
            return 'Medium Risk'
        elif score < 740:
            return 'Low Risk'
        else:
            return 'Very Low Risk'
    
    bank_data['RiskCategory'] = bank_data['CreditScore'].apply(assign_risk_category)
    print("Risk categories created successfully")
    
    # Custom JSON encoder to handle NumPy and Pandas types
         # Custom JSON encoder to handle NumPy and Pandas types
    class NpEncoder(json.JSONEncoder):  # Now has 4 spaces
        def default(self, obj):         # Methods inside class need 8 spaces (4+4)
            if isinstance(obj, np.integer):
                return int(obj)
            if isinstance(obj, np.floating):
                # Handle NaN values by converting them to null
                if np.isnan(obj):
                    return None
                return float(obj)
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            if pd.isna(obj):
                return None
            if isinstance(obj, pd.Timestamp):
                return str(obj)
            return super(NpEncoder, self).default(obj)
    # Create the dashboard data dictionary
    dashboard_data = {
        "customer_demographics": {
            "gender_distribution": bank_data['Gender'].value_counts().to_dict(),
            "age_distribution": bank_data.groupby(pd.cut(bank_data['Age'], [18, 30, 40, 50, 60, 81], 
                                                 labels=['18-30', '31-40', '41-50', '51-60', '61+'])).size().to_dict(),
            "education_distribution": bank_data['EducationLevel'].value_counts().to_dict(),
            "marital_status": bank_data['MaritalStatus'].value_counts().to_dict(),
            "employment_status": bank_data['EmploymentStatus'].value_counts().to_dict()
        },
        "account_info": {
            "account_types": bank_data['AccountType'].value_counts().to_dict(),
            "balance_by_account_type": bank_data.groupby('AccountType')['Balance'].mean().to_dict(),
            "avg_balance": float(bank_data['Balance'].mean()),
            "median_balance": float(bank_data['Balance'].median()),
            "max_balance": float(bank_data['Balance'].max()),
            "min_balance": float(bank_data['Balance'].min())
        },
        "geographical_data": {
            "customer_by_city": bank_data['City'].value_counts().to_dict(),
            "avg_balance_by_city": bank_data.groupby('City')['Balance'].mean().to_dict(),
            "account_types_by_city": {city: bank_data[bank_data['City'] == city]['AccountType'].value_counts().to_dict() 
                                     for city in bank_data['City'].unique()}
        },
        "transaction_data": {
            "avg_transactions": float(bank_data['NumTransactions30Days'].mean()),
            "transactions_by_account_type": bank_data.groupby('AccountType')['NumTransactions30Days'].mean().to_dict(),
            "transactions_by_income": bank_data.groupby('IncomeCategory')['NumTransactions30Days'].mean().to_dict()
        },
        "risk_data": {
            "risk_distribution": bank_data['RiskCategory'].value_counts().to_dict(),
            "risk_by_account_type": {acc_type: bank_data[bank_data['AccountType'] == acc_type]['RiskCategory'].value_counts().to_dict() 
                                    for acc_type in bank_data['AccountType'].unique()},
            "avg_credit_score": float(bank_data['CreditScore'].mean())
        },
        "loan_data": {
            "loan_status": bank_data['HasLoan'].value_counts().to_dict(),
            "loan_types": bank_data[bank_data['HasLoan'] == 'Yes']['LoanType'].value_counts().to_dict(),
            "avg_loan_amount": float(bank_data[bank_data['HasLoan'] == 'Yes']['LoanAmount'].mean()) if any(bank_data['HasLoan'] == 'Yes') else 0,
            "loan_by_employment": {emp: int(bank_data[(bank_data['EmploymentStatus'] == emp) & (bank_data['HasLoan'] == 'Yes')].shape[0]) 
                                  for emp in bank_data['EmploymentStatus'].unique()}
        },
        "raw_data": bank_data.head(50).to_dict(orient='records')
    }
    
    # Add transaction by age group data - ADD CODE HERE
    age_bins = [18, 30, 40, 50, 60, 81]
    age_labels = ['18-30', '31-40', '41-50', '51-60', '61+']
    bank_data['AgeGroup'] = pd.cut(bank_data['Age'], age_bins, labels=age_labels)
    transactions_by_age = bank_data.groupby('AgeGroup')['NumTransactions30Days'].mean().to_dict()
    dashboard_data['transaction_data']['transactions_by_age_group'] = transactions_by_age

    # Create segmentation data (this would typically come from a clustering algorithm)
    # For this example, we'll create simple segments based on balance and transaction frequency
    def assign_segment(row):
        if row['Balance'] > 200000 and row['NumTransactions30Days'] > 20:
            return 0  # High value, active customers
        elif row['Balance'] > 200000:
            return 1  # High value, less active
        elif row['NumTransactions30Days'] > 20:
            return 2  # Lower value, very active
        else:
            return 3  # Standard customers

    bank_data['Segment'] = bank_data.apply(assign_segment, axis=1)
    segments = bank_data['Segment'].value_counts().to_dict()

    # Create segment profiles
    segment_profiles = {}
    for segment in bank_data['Segment'].unique():
        segment_data = bank_data[bank_data['Segment'] == segment]
        segment_profiles[str(segment)] = {
            'avg_age': float(segment_data['Age'].mean()),
            'avg_balance': float(segment_data['Balance'].mean()),
            'avg_credit_score': float(segment_data['CreditScore'].mean()),
            'avg_transactions': float(segment_data['NumTransactions30Days'].mean())
        }

    # Add segmentation data to dashboard_data
    dashboard_data['segmentation_data'] = {
        'clusters': segments,
        'cluster_profiles': segment_profiles
    }
    
       # Convert to JSON
    print("Converting data to JSON...")
    
    # Replace NaN values with None in raw data before serialization
    for record in dashboard_data["raw_data"]:
        for key, value in record.items():
            if pd.isna(value):
                record[key] = None
    
    json_file_path = 'bank_dashboard_data.json'
    with open(json_file_path, 'w') as f:
        json.dump(dashboard_data, f, indent=4, cls=NpEncoder)
except Exception as e:
    print(f"Error: {str(e)}")
    import traceback
    traceback.print_exc()
