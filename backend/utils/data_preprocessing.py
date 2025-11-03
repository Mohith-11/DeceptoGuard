"""
Data preprocessing utilities for DeceptoGuard
Handles URL cleaning and dataset preparation
"""

import re
import pandas as pd
from urllib.parse import urlparse

def preprocess_url(url):
    """
    Clean and preprocess a URL for feature extraction
    
    Args:
        url (str): Raw URL input
        
    Returns:
        str: Cleaned URL
    """
    if not url:
        return ""
    
    # Strip whitespace
    url = url.strip()
    
    # Add protocol if missing
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    
    # Convert to lowercase (except for path that might be case-sensitive)
    parsed = urlparse(url)
    cleaned_url = f"{parsed.scheme.lower()}://{parsed.netloc.lower()}{parsed.path}{parsed.params}{parsed.query}{parsed.fragment}"
    
    return cleaned_url

def clean_dataset(df):
    """
    Clean a dataset of URLs for training
    
    Args:
        df (pandas.DataFrame): DataFrame with 'url' and 'label' columns
        
    Returns:
        pandas.DataFrame: Cleaned dataset
    """
    # Remove duplicates
    df = df.drop_duplicates(subset=['url'])
    
    # Remove rows with missing URLs
    df = df.dropna(subset=['url'])
    
    # Clean URLs
    df['url'] = df['url'].apply(preprocess_url)
    
    # Remove invalid URLs
    df = df[df['url'].str.len() > 0]
    
    # Ensure labels are binary (0 for legitimate, 1 for phishing)
    if 'label' in df.columns:
        df['label'] = df['label'].astype(int)
        df = df[df['label'].isin([0, 1])]
    
    return df

def validate_url_format(url):
    """
    Validate if a URL has a proper format
    
    Args:
        url (str): URL to validate
        
    Returns:
        bool: True if valid format, False otherwise
    """
    url_pattern = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    return url_pattern.match(url) is not None

def extract_domain(url):
    """
    Extract domain from URL
    
    Args:
        url (str): URL to extract domain from
        
    Returns:
        str: Domain name
    """
    try:
        parsed = urlparse(url)
        return parsed.netloc.lower()
    except:
        return ""

def get_url_statistics(urls):
    """
    Get statistical information about a list of URLs
    
    Args:
        urls (list): List of URLs
        
    Returns:
        dict: Statistics about the URLs
    """
    if not urls:
        return {}
    
    lengths = [len(url) for url in urls]
    domains = [extract_domain(url) for url in urls]
    unique_domains = len(set(domains))
    
    https_count = sum(1 for url in urls if url.startswith('https://'))
    
    return {
        'total_urls': len(urls),
        'unique_domains': unique_domains,
        'avg_length': sum(lengths) / len(lengths),
        'min_length': min(lengths),
        'max_length': max(lengths),
        'https_percentage': (https_count / len(urls)) * 100
    }