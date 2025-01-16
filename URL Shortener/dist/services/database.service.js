"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
class MongoService {
    static connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ensure connection is not already established
                if (mongoose_1.default.connection.readyState === 0) {
                    console.log('Connecting to MongoDB...');
                    // Attempt to connect to MongoDB using the connection string from environment variables
                    yield mongoose_1.default.connect("mongodb+srv://abhayimp17:cT5NPYVjU3ga3ywA@todo.qo6lv.mongodb.net/mydbv4?retryWrites=true&w=majority&appName=todo", {});
                    console.log('MongoDB Connected');
                }
                else {
                    console.log('MongoDB already connected');
                }
            }
            catch (error) {
                console.error('MongoDB connection error:', error);
                throw new Error('Error connecting to MongoDB');
            }
        });
    }
}
exports.MongoService = MongoService;
