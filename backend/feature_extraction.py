import re
from urllib.parse import urlparse

def extract_features(url):
    """
    Extract features from a URL for phishing detection
    
    Returns a list of features:
    [url_length, has_ip, has_at, num_digits, has_https, num_subdomains, has_brand_typo]
    """
    
    # Parse the URL
    parsed = urlparse(url)
    domain = parsed.netloc
    path = parsed.path
    
    # Feature 1: URL Length
    url_length = len(url)
    
    # Feature 2: Has IP address
    ip_pattern = r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}'
    has_ip = 1 if re.search(ip_pattern, domain) else 0
    
    # Feature 3: Has @ symbol
    has_at = 1 if '@' in url else 0
    
    # Feature 4: Number of digits
    num_digits = len(re.findall(r'\d', url))
    
    # Feature 5: Has HTTPS
    has_https = 1 if parsed.scheme == 'https' else 0
    
    # Feature 6: Number of subdomains
    num_subdomains = domain.count('.') - 1 if domain else 0
    
    # Feature 7: Brand typo detection
    brands = ['google', 'facebook', 'paypal', 'amazon', 'netflix', 'microsoft', 'apple']
    has_brand_typo = 0
    
    domain_lower = domain.lower()
    for brand in brands:
        # Check for common typos
        typo_patterns = [
            brand.replace('o', '0'),  # o -> 0
            brand.replace('l', '1'),  # l -> 1
            brand.replace('i', '1'),  # i -> 1
            brand.replace('e', '3'),  # e -> 3
            brand + '-login',
            brand + '-verify',
            brand + '-secure',
            'secure-' + brand,
        ]
        
        for pattern in typo_patterns:
            if pattern in domain_lower and brand not in domain_lower:
                has_brand_typo = 1
                break
        
        if has_brand_typo:
            break
    
    return [
        url_length,
        has_ip,
        has_at,
        num_digits,
        has_https,
        num_subdomains,
        has_brand_typo
    ]

# Test function
if __name__ == '__main__':
    test_urls = [
        'https://google.com',
        'http://g00gle-login.com/verify',
        'http://192.168.1.1/paypal',
        'https://secure-paypa1.com/login'
    ]
    
    for url in test_urls:
        features = extract_features(url)
        print(f"\nURL: {url}")
        print(f"Features: {features}")
