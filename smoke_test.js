/**
 * Script de Smoke Test pour EasyShop
 * Vérifie les fonctionnalités critiques de l'API
 * 
 * Usage: node smoke_test.js
 * Prérequis: Backend démarré sur http://localhost:4000
 */

const BASE_URL = 'http://localhost:4000/api';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

let token = null;
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

/**
 * Fonction utilitaire pour faire des requêtes HTTP
 */
async function request(method, endpoint, data = null, headers = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const responseData = await response.json().catch(() => ({}));

    return {
      status: response.status,
      data: responseData,
      ok: response.ok
    };
  } catch (error) {
    return {
      status: 0,
      data: { error: error.message },
      ok: false
    };
  }
}

/**
 * Fonction pour afficher les résultats de test
 */
function logTest(name, passed, message = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`${colors.green}✓${colors.reset} ${name}${message ? ' - ' + message : ''}`);
  } else {
    testResults.failed++;
    console.log(`${colors.red}✗${colors.reset} ${name}${message ? ' - ' + message : ''}`);
  }
}

/**
 * Test 1: Health Check
 */
async function testHealthCheck() {
  console.log(`\n${colors.blue}[Test 1]${colors.reset} Health Check`);
  const result = await request('GET', '/health');
  const passed = result.status === 200 && result.data.status === 'OK';
  logTest('GET /api/health', passed, passed ? 'Serveur opérationnel' : `Status: ${result.status}`);
  return passed;
}

/**
 * Test 2: Liste des produits
 */
async function testGetProducts() {
  console.log(`\n${colors.blue}[Test 2]${colors.reset} Liste des produits`);
  const result = await request('GET', '/products');
  const passed = result.status === 200 && Array.isArray(result.data) && result.data.length >= 3;
  logTest('GET /api/products', passed, passed 
    ? `Retourne ${result.data.length} produits` 
    : `Status: ${result.status}, Produits: ${result.data.length || 0}`);
  return passed;
}

/**
 * Test 3: Détails d'un produit
 */
async function testGetProductById() {
  console.log(`\n${colors.blue}[Test 3]${colors.reset} Détails d'un produit`);
  const result = await request('GET', '/products/1');
  const passed = result.status === 200 && result.data.id === 1 && result.data.title;
  logTest('GET /api/products/1', passed, passed 
    ? `Produit: ${result.data.title}` 
    : `Status: ${result.status}`);
  return passed;
}

/**
 * Test 4: Connexion utilisateur
 */
async function testLogin() {
  console.log(`\n${colors.blue}[Test 4]${colors.reset} Connexion utilisateur`);
  const result = await request('POST', '/auth/login', {
    email: 'alice@example.com',
    password: 'Password1!'
  });
  const passed = result.status === 200 && result.data.token;
  if (passed) {
    token = result.data.token;
    logTest('POST /api/auth/login', true, `Token obtenu pour ${result.data.user?.email || 'alice@example.com'}`);
  } else {
    logTest('POST /api/auth/login', false, `Status: ${result.status}, Erreur: ${result.data.error || 'Unknown'}`);
  }
  return passed;
}

/**
 * Test 5: Ajouter au panier (avec authentification)
 */
async function testAddToCart() {
  console.log(`\n${colors.blue}[Test 5]${colors.reset} Ajouter au panier`);
  if (!token) {
    logTest('POST /api/cart/add', false, 'Token manquant (test précédent échoué)');
    return false;
  }

  const result = await request('POST', '/cart/add', {
    productId: 1,
    qty: 1
  }, {
    'Authorization': `Bearer ${token}`
  });

  const passed = result.status === 201 && result.data.message;
  logTest('POST /api/cart/add', passed, passed 
    ? 'Produit ajouté au panier' 
    : `Status: ${result.status}, Erreur: ${result.data.error || 'Unknown'}`);
  return passed;
}

/**
 * Test 6: Consulter le panier
 */
async function testGetCart() {
  console.log(`\n${colors.blue}[Test 6]${colors.reset} Consulter le panier`);
  if (!token) {
    logTest('GET /api/cart', false, 'Token manquant');
    return false;
  }

  const result = await request('GET', '/cart', null, {
    'Authorization': `Bearer ${token}`
  });

  const passed = result.status === 200 && Array.isArray(result.data.items);
  logTest('GET /api/cart', passed, passed 
    ? `Panier contient ${result.data.items.length} item(s), Total: ${result.data.total}€` 
    : `Status: ${result.status}`);
  return passed;
}

/**
 * Test 7: Créer une commande
 */
async function testCreateOrder() {
  console.log(`\n${colors.blue}[Test 7]${colors.reset} Créer une commande`);
  if (!token) {
    logTest('POST /api/orders', false, 'Token manquant');
    return false;
  }

  const result = await request('POST', '/orders', null, {
    'Authorization': `Bearer ${token}`
  });

  const passed = result.status === 201 && result.data.order;
  logTest('POST /api/orders', passed, passed 
    ? `Commande #${result.data.order.id} créée, Total: ${result.data.order.total}€` 
    : `Status: ${result.status}, Erreur: ${result.data.error || 'Unknown'}`);
  return passed;
}

/**
 * Test 8: Tentative d'accès sans authentification
 */
async function testUnauthorizedAccess() {
  console.log(`\n${colors.blue}[Test 8]${colors.reset} Accès non autorisé`);
  const result = await request('GET', '/cart');
  const passed = result.status === 401;
  logTest('GET /api/cart (sans token)', passed, passed 
    ? 'Accès correctement refusé (401)' 
    : `Status: ${result.status} (attendu: 401)`);
  return passed;
}

/**
 * Fonction principale
 */
async function runSmokeTests() {
  console.log(`${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║   EasyShop - Smoke Test Suite         ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════╝${colors.reset}`);
  console.log(`\nBase URL: ${BASE_URL}`);
  console.log(`Date: ${new Date().toISOString()}\n`);

  try {
    // Exécuter les tests
    await testHealthCheck();
    await testGetProducts();
    await testGetProductById();
    await testLogin();
    await testAddToCart();
    await testGetCart();
    await testCreateOrder();
    await testUnauthorizedAccess();

    // Résumé
    console.log(`\n${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.blue}║   Résumé des Tests                     ║${colors.reset}`);
    console.log(`${colors.blue}╚════════════════════════════════════════╝${colors.reset}`);
    console.log(`Total: ${testResults.total}`);
    console.log(`${colors.green}Passés: ${testResults.passed}${colors.reset}`);
    console.log(`${colors.red}Échoués: ${testResults.failed}${colors.reset}`);
    
    const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
    console.log(`Taux de réussite: ${successRate}%`);

    if (testResults.failed === 0) {
      console.log(`\n${colors.green}✅ SMOKE TEST: SUCCESS${colors.reset}\n`);
      process.exit(0);
    } else {
      console.log(`\n${colors.red}❌ SMOKE TEST: FAIL${colors.reset}\n`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`${colors.red}Erreur fatale:${colors.reset}`, error);
    process.exit(1);
  }
}

// Vérifier si fetch est disponible (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error(`${colors.red}Erreur:${colors.reset} fetch n'est pas disponible.`);
  console.error('Ce script nécessite Node.js 18+ ou l\'installation de node-fetch.');
  process.exit(1);
}

// Lancer les tests
runSmokeTests();

