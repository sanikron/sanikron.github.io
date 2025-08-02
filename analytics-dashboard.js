class AnalyticsDashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.agents = {
            dataCleaning: {
                name: 'Data Cleaning Agent',
                status: 'active',
                lastRun: new Date(),
                issuesFixed: 0
            },
            featureEngineering: {
                name: 'Feature Engineering Agent',
                status: 'active',
                featuresGenerated: 0,
                performanceGain: 0
            },
            analytics: {
                name: 'Analytics Agent',
                status: 'active',
                insightsGenerated: 0,
                lastQuery: ''
            },
            modelBuilder: {
                name: 'Model Builder Agent',
                status: 'idle',
                modelsTrained: 0,
                accuracy: 0
            },
            multiAgent: {
                name: 'Multi-Agent System',
                status: 'active',
                agentsSynced: 5,
                tasksCompleted: 0
            }
        };
        
        this.queries = [
            "Show sales trends by product category",
            "Predict next month's revenue",
            "Identify key customer segments",
            "Analyze feature importance",
            "Detect data anomalies"
        ];
        
        this.init();
    }
    
    init() {
        this.createUI();
        this.simulateAgents();
        this.setupEventListeners();
    }
    
    createUI() {
        this.container.innerHTML = `
            <div class="bg-gray-900 rounded-lg overflow-hidden h-full flex flex-col">
                <!-- Header -->
                <div class="bg-gray-800 h-10 flex items-center px-4 border-b border-gray-700">
                    <div class="flex space-x-2 mr-4">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div class="text-xs text-gray-400">Sreni Agents</div>
                    <div class="ml-auto text-xs text-gray-500">Sreni v1.0.0</div>
                </div>
                
                <!-- Main Content -->
                <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-auto">
                    <!-- Left Panel -->
                    <div class="md:col-span-2 space-y-4">
                        <!-- Query Input -->
                        <div class="bg-gray-800 rounded-lg p-4">
                            <div class="flex items-center space-x-2 mb-2">
                                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                                <div class="text-sm text-gray-300">Ask Sreni</div>
                            </div>
                            <div class="relative">
                                <input type="text" id="queryInput" 
                                    class="w-full bg-gray-700 text-gray-200 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ask your data anything...">
                                <button id="askBtn" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Response Area -->
                        <div class="bg-gray-800 rounded-lg p-4 h-64 overflow-auto">
                            <div class="flex items-center space-x-2 mb-3">
                                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                                <div class="text-sm text-gray-300">Sreni Assistant</div>
                            </div>
                            <div id="responseArea" class="text-gray-200 text-sm space-y-2">
                                <div class="text-green-400">// Sreni AI Assistant Initialized</div>
                                <div class="text-gray-500">Type your data question above to get started...</div>
                            </div>
                        </div>
                        
                        <!-- Agent Status -->
                        <div class="grid grid-cols-2 gap-4">
                            ${Object.entries(this.agents).map(([key, agent]) => `
                                <div class="bg-gray-800 rounded-lg p-3">
                                    <div class="flex items-center justify-between mb-1">
                                        <div class="text-xs font-medium text-gray-300">${agent.name}</div>
                                        <div class="flex items-center">
                                            <div class="w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'} mr-1"></div>
                                            <span class="text-xs text-gray-400">${agent.status}</span>
                                        </div>
                                    </div>
                                    <div class="text-xs text-gray-400" id="${key}Stats">
                                        ${this.getAgentStats(agent)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Right Panel -->
                    <div class="space-y-4">
                        <!-- Data Visualization -->
                        <div class="bg-gray-800 rounded-lg p-4">
                            <div class="flex items-center space-x-2 mb-3">
                                <div class="w-2 h-2 rounded-full bg-purple-500"></div>
                                <div class="text-sm text-gray-300">Data Visualization</div>
                            </div>
                            <div id="chartContainer" class="h-48 bg-gray-700 rounded flex items-center justify-center">
                                <div class="text-center text-gray-400 text-sm">
                                    <div class="text-4xl mb-1">📊</div>
                                    <div>Visualization will appear here</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- System Status -->
                        <div class="bg-gray-800 rounded-lg p-4">
                            <div class="flex items-center space-x-2 mb-3">
                                <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <div class="text-sm text-gray-300">System Status</div>
                            </div>
                            <div class="space-y-2">
                                <div class="flex justify-between text-xs">
                                    <span class="text-gray-400">CPU Usage</span>
                                    <span class="text-gray-200" id="cpuUsage">12%</span>
                                </div>
                                <div class="w-full bg-gray-700 rounded-full h-1.5">
                                    <div class="bg-blue-500 h-1.5 rounded-full" style="width: 12%"></div>
                                </div>
                                <div class="flex justify-between text-xs mt-3">
                                    <span class="text-gray-400">Memory</span>
                                    <span class="text-gray-200" id="memoryUsage">24%</span>
                                </div>
                                <div class="w-full bg-gray-700 rounded-full h-1.5">
                                    <div class="bg-green-500 h-1.5 rounded-full" style="width: 24%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getAgentStats(agent) {
        if (agent.name === 'Data Cleaning Agent') {
            return `Fixed ${agent.issuesFixed} issues`;
        } else if (agent.name === 'Feature Engineering Agent') {
            return `+${agent.performanceGain}% model gain`;
        } else if (agent.name === 'Analytics Agent') {
            return `${agent.insightsGenerated} insights`;
        } else if (agent.name === 'Model Builder Agent') {
            return `${agent.modelsTrained} models`;
        } else if (agent.name === 'Multi-Agent System') {
            return `${agent.tasksCompleted} tasks completed`;
        }
        return '';
    }
    
    simulateAgents() {
        setInterval(() => {
            this.agents.dataCleaning.issuesFixed += Math.floor(Math.random() * 3);
            this.updateAgentStats('dataCleaning');
        }, 3000);
        
        setInterval(() => {
            this.agents.featureEngineering.performanceGain = (Math.random() * 5).toFixed(1);
            this.updateAgentStats('featureEngineering');
        }, 5000);
        
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.agents.modelBuilder.modelsTrained++;
                this.agents.modelBuilder.accuracy = (Math.random() * 20 + 80).toFixed(1);
                this.updateAgentStats('modelBuilder');
            }
        }, 8000);
        
        setInterval(() => {
            try {
                document.getElementById('cpuUsage').textContent = 
                Math.floor(Math.random() * 15 + 5) + '%';
                document.querySelector('#cpuUsage + div > div').style.width = 
                Math.floor(Math.random() * 15 + 5) + '%';
                
                document.getElementById('memoryUsage').textContent = 
                Math.floor(Math.random() * 20 + 15) + '%';
                document.querySelector('#memoryUsage + div > div').style.width = 
                Math.floor(Math.random() * 20 + 15) + '%';
            } catch (error) {
                // console.error('Error updating system metrics:', error);
            }
            
        }, 2000);
    }
    
    updateAgentStats(agentKey) {
        const statsElement = document.getElementById(`${agentKey}Stats`);
        if (statsElement) {
            statsElement.textContent = this.getAgentStats(this.agents[agentKey]);
        }
    }
    
    setupEventListeners() {
        const queryInput = document.getElementById('queryInput');
        const askBtn = document.getElementById('askBtn');
        const responseArea = document.getElementById('responseArea');
        
        if (!queryInput || !askBtn || !responseArea) return;
        
        const processQuery = () => {
            const query = queryInput.value.trim();
            if (!query) return;
            
            // Add user query to response area
            responseArea.innerHTML += `
                <div class="text-right mb-2">
                    <div class="inline-block bg-blue-600 text-white text-sm rounded-lg px-3 py-1 max-w-full break-words">
                        ${query}
                    </div>
                </div>
            `;
            
            // Clear input
            queryInput.value = '';
            
            // Simulate processing
            responseArea.innerHTML += `
                <div class="text-gray-500 text-xs mb-4 flex items-center">
                    <div class="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                    Sreni is analyzing your request...
                </div>
            `;
            
            // Simulate response after delay
            setTimeout(() => {
                // Remove "analyzing" message
                responseArea.removeChild(responseArea.lastChild);
                
                // Add response
                responseArea.innerHTML += `
                    <div class="text-left mb-4">
                        <div class="inline-block bg-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 max-w-full break-words">
                            ${this.generateResponse(query)}
                        </div>
                    </div>
                `;
                
                // Update analytics agent stats
                this.agents.analytics.insightsGenerated++;
                this.agents.analytics.lastQuery = query;
                this.updateAgentStats('analytics');
                
                // Update multi-agent system stats
                this.agents.multiAgent.tasksCompleted++;
                this.updateAgentStats('multiAgent');
                
                // Auto-scroll to bottom
                responseArea.scrollTop = responseArea.scrollHeight;
            }, 1500);
            
            // Auto-scroll to bottom
            responseArea.scrollTop = responseArea.scrollHeight;
        };
        
        askBtn.addEventListener('click', processQuery);
        queryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') processQuery();
        });
        
        // Add some sample queries as suggestions
        let queryIndex = 0;
        const rotateQuery = () => {
            queryInput.placeholder = `e.g. "${this.queries[queryIndex]}"`;
            queryIndex = (queryIndex + 1) % this.queries.length;
        };
        
        rotateQuery();
        setInterval(rotateQuery, 3000);
    }
    
    generateResponse(query) {
        const responses = [
            `Based on the analysis of your data, I've identified key trends in the requested categories. The data shows a ${Math.floor(Math.random() * 30) + 10}% increase in the last quarter.`,
            `I've processed your query about "${query.toLowerCase()}". The model has identified ${Math.floor(Math.random() * 5) + 1} key insights that can help optimize your strategy.`,
            `The analysis reveals interesting patterns in your dataset. The correlation between key metrics shows a ${Math.floor(Math.random() * 60) + 30}% confidence level.`,
            `I've completed the analysis you requested. The data suggests ${['positive', 'negative', 'stable'][Math.floor(Math.random() * 3)]} trends in the specified parameters.`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize the dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnalyticsDashboard('analyticsDashboard');
});
